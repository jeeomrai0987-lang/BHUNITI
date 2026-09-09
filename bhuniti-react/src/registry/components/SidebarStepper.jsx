import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { WIZARD_STEPS, registryServicePath } from '../routes.js'
import { useI18n } from '../i18n/index.jsx'
import { useRegistry } from '../context/RegistryContext.jsx'

/**
 * The vertical progress rail that Owner & Party, Transaction & Documents and
 * Review & Submission each drew for themselves.
 *
 * All three had their own hard-coded list, and the lists disagreed: step 2
 * was "Owner & Party Details" in one, "Parties" in another and "Initiation"
 * in the third, and the Review page's steps 1 and 3 both pointed at the
 * Parcel route. Four vocabularies for six steps would have meant four
 * different Hindi words for the same thing, so they now all render this
 * component off the canonical list in routes.js.
 *
 * `upto` limits how many steps are shown, matching what each page displayed.
 */
export default function SidebarStepper({ current, upto = WIZARD_STEPS.length }) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { registry } = useRegistry()
  const steps = WIZARD_STEPS.slice(0, upto)

  return (
    <div className="relative flex flex-col gap-8 mt-4">
      <div
        aria-hidden="true"
        className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-surface-container-highest z-0"
      />

      <ol aria-label={t('steps.listLabel')} className="contents list-none m-0 p-0">
        {steps.map((step) => {
          const state = step.n < current ? 'done' : step.n === current ? 'active' : 'todo'
          const title = t(`steps.${step.key}.title`)

          return (
            <li className="contents" key={step.n}>
              <button
                aria-current={state === 'active' ? 'step' : undefined}
                className={`relative z-10 flex items-start gap-4 text-left group ${
                  state === 'todo' ? 'opacity-50 grayscale hover:opacity-80' : ''
                }`}
                onClick={() => navigate(registryServicePath(registry.serviceType, step.segment))}
                type="button"
              >
                {state === 'done' && (
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-status-success shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  >
                    <Icon className="text-surface-white text-[18px]" name="check" />
                  </div>
                )}
                {state === 'active' && (
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-secondary shadow-md flex items-center justify-center shrink-0 ring-4 ring-background"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-white" />
                  </div>
                )}
                {state === 'todo' && (
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0"
                  >
                    <span className="font-tabular-nums text-body-sm text-on-surface-variant font-medium">
                      {step.n}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1 pt-1">
                  <span
                    className={`font-label-caps text-label-caps tracking-wider ${
                      state === 'active' ? 'text-secondary' : 'text-on-surface-variant'
                    }`}
                  >
                    {t('stepN', { n: step.n })}
                  </span>
                  <span
                    className={
                      state === 'active'
                        ? 'font-headline-md text-body-lg text-on-surface font-semibold'
                        : `font-body-md text-body-md text-on-surface ${
                            state === 'done' ? 'line-through opacity-70' : ''
                          }`
                    }
                  >
                    {title}
                  </span>
                  {state === 'active' && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {t(`steps.${step.key}.hint`)}
                    </p>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
