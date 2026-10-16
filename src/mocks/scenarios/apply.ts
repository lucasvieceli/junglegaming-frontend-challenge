import { HttpResponse, delay } from 'msw'
import type { DefaultBodyType, HttpResponseResolver, PathParams } from 'msw'

import { randomBetween } from '../lib/prng'
import { MockHttpError, apiError, errorResponse } from '../lib/respond'
import { countHit, getScenario } from './store'
import type { ScenarioConfig, ScenarioFailure } from './types'

function latencyFor(config: ScenarioConfig, request: Request): number {
  const { mode, minMs, maxMs } = config.latency
  if (mode === 'fixed') return minMs
  if (mode === 'variable') return randomBetween(minMs, maxMs)
  return new URL(request.url).pathname.endsWith('/nfts') ? randomBetween(minMs, maxMs) : 150
}

const matches = (rule: { match: RegExp; method?: string }, request: Request) =>
  rule.match.test(new URL(request.url).pathname) && (!rule.method || rule.method === request.method)

function shouldFail(rule: ScenarioFailure, index: number): boolean {
  const hit = countHit(`failure:${index}`)
  if (rule.mode === 'always') return true
  if (rule.mode === 'first-n') return hit <= (rule.times ?? 1)
  return hit % 2 === 1
}

export function withScenario<P extends PathParams, B extends DefaultBodyType>(
  resolver: HttpResponseResolver<P, B>,
): HttpResponseResolver<P, B> {
  return async (info) => {
    const config = getScenario()
    const { request } = info
    await delay(latencyFor(config, request))

    if (config.network === 'offline') return HttpResponse.error()

    const failureIndex = config.failures.findIndex((rule) => matches(rule, request))
    const failure = config.failures[failureIndex]
    if (failure && shouldFail(failure, failureIndex)) {
      return apiError(failure.status, failure.code, failure.message, {
        fieldErrors: failure.fieldErrors,
      })
    }

    // Run the resolver before the timeout delay: MSW doesn't cancel it when the client aborts.
    let response: Awaited<ReturnType<typeof resolver>>
    try {
      response = await resolver(info)
    } catch (error) {
      if (error instanceof MockHttpError) return errorResponse(error)
      throw error
    }

    const timeoutIndex = config.timeouts.findIndex((rule) => matches(rule, request))
    const timeout = config.timeouts[timeoutIndex]
    if (timeout && countHit(`timeout:${timeoutIndex}`) <= timeout.times)
      await delay(timeout.delayMs)
    return response
  }
}
