'use client'

import { useContext } from 'react'

import { Switch, Button } from '@janhq/uikit'

import { FeatureToggleContext } from '@/context/FeatureToggle'

const Advanced = () => {
  const { experimentalFeatureEnabed, setExperimentalFeatureEnabled } =
    useContext(FeatureToggleContext)

  return (
    <div className="block w-full">
      <div className="flex w-full items-start justify-between border-b border-border py-4 first:pt-0 last:border-none">
        <div className="w-4/5 flex-shrink-0 space-y-1.5">
          <div className="flex gap-x-2">
            <h6 className="text-sm font-semibold capitalize">
              Experimental Mode
            </h6>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">
            Enable experimental features that may be unstable
            tested.
          </p>
        </div>
        <Switch
          checked={experimentalFeatureEnabed}
          onCheckedChange={(e) => {
            if (e === true) {
              setExperimentalFeatureEnabled(true)
            } else {
              setExperimentalFeatureEnabled(false)
            }
          }}
        />
      </div>
      {window.electronAPI && (
        <div className="flex w-full items-start justify-between border-b border-border py-4 first:pt-0 last:border-none">
          <div className="w-4/5 flex-shrink-0 space-y-1.5">
            <div className="flex gap-x-2">
              <h6 className="text-sm font-semibold capitalize">
                Open App Directory
              </h6>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">
              Open the directory where your app data, like conversation history and model configurations, is located.
            </p>
          </div>
          <Button
            size="sm"
            themes="secondary"
            onClick={() => window.electronAPI.openAppDirectory()}
          >
            Open
          </Button>
        </div>
      )}
    </div>
  )
}

export default Advanced
