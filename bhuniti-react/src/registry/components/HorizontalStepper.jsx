import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { WIZARD_STEPS, TOTAL_STEPS, registryServicePath } from '../routes.js'
import { useI18n } from '../i18n/index.jsx'
import { useRegistry } from '../context/RegistryContext.jsx'

/**
 * The 6-step horizontal stepper from Parcel Identification.html.
 * Same markup, except each step is now a button that routes to its page.
 *
 * Wrapped in an <ol> so the sequence is conveyed structurally rather than
 * only visually, and each button carries "Step n of 6" so it is meaningful
 * when read out of context. The connector rules are decorative.
 */
export default function HorizontalStepper({ currentStep = 1 }) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { registry } = useRegistry()

  return (
    <div className="w-full bg-surface-white rounded-xl shadow-sm p-4 overflow-x-auto border-none">
      <ol
        aria-label={t('steps.listLabel')}
        className="flex items-center min-w-max list-none m-0 p-0"
      >
        {WIZARD_STEPS.map((step, i) => {
          const isActive = step.n === currentStep
          const isDone = step.n < currentStep
          const label = t(`steps.${step.key}.short`)

          return (
            <li className="flex items-center" key={step.n}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="w-8 lg:w-16 h-px bg-outline-variant mx-4"
                />
              )}

              <button
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${t('stepOf', { current: step.n, total: TOTAL_STEPS })} — ${label}`}
                className={`flex items-center text-left ${
                  isActive ? '' : 'opacity-60 hover:opacity-100'
                } transition-opacity`}
                onClick={() => navigate(registryServicePath(registry.serviceType, step.segment))}
                type="button"
              >
                <div
                  aria-hidden="true"
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-primary'
                      : isDone
                        ? 'bg-status-success'
                        : 'bg-surface-container-high'
                  }`}
                >
                  {isDone ? (
                    <Icon className="text-surface-white text-[18px]" name="check" />
                  ) : (
                    <span
                      className={`text-label-caps font-label-caps ${
                        isActive ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {step.n}
                    </span>
                  )}
                </div>

                <span
                  className={`ml-3 text-label-caps font-label-caps whitespace-nowrap ${
                    isActive ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
