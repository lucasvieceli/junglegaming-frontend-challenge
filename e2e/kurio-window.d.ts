import type { KurioControlApi } from '../src/mocks/control/window-api'

declare global {
  interface Window {
    __kurio?: KurioControlApi
  }
}
