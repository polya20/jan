import { useCallback, useEffect, useState } from 'react'

import { InferenceEngine, Model } from '@janhq/core'
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
  Input,
} from '@janhq/uikit'

import { atom, useAtomValue, useSetAtom } from 'jotai'

import { MonitorIcon } from 'lucide-react'

import { twMerge } from 'tailwind-merge'

import { MainViewState } from '@/constants/screens'

import { useEngineSettings } from '@/hooks/useEngineSettings'

import { useMainViewState } from '@/hooks/useMainViewState'

import useRecommendedModel from '@/hooks/useRecommendedModel'

import { toGigabytes } from '@/utils/converter'

import { activeThreadAtom, threadStatesAtom } from '@/helpers/atoms/Thread.atom'

export const selectedModelAtom = atom<Model | undefined>(undefined)

export default function DropdownListSidebar() {
  const setSelectedModel = useSetAtom(selectedModelAtom)
  const threadStates = useAtomValue(threadStatesAtom)
  const activeThread = useAtomValue(activeThreadAtom)
  const [selected, setSelected] = useState<Model | undefined>()
  const { setMainViewState } = useMainViewState()
  const [openAISettings, setOpenAISettings] = useState<
    { api_key: string } | undefined
  >(undefined)
  const { readOpenAISettings, saveOpenAISettings } = useEngineSettings()

  useEffect(() => {
    readOpenAISettings().then((settings) => {
      setOpenAISettings(settings)
    })
  }, [])

  const { recommendedModel, downloadedModels } = useRecommendedModel()

  useEffect(() => {
    setSelected(recommendedModel)
    setSelectedModel(recommendedModel)
  }, [recommendedModel, setSelectedModel])

  const onValueSelected = useCallback(
    (modelId: string) => {
      const model = downloadedModels.find((m) => m.id === modelId)
      setSelected(model)
      setSelectedModel(model)
    },
    [downloadedModels, setSelectedModel]
  )

  if (!activeThread) {
    return null
  }
  const finishInit = threadStates[activeThread.id].isFinishInit ?? true

  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        <Select
          disabled={finishInit}
          value={selected?.id}
          onValueChange={finishInit ? undefined : onValueSelected}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose model to start">
              {downloadedModels.filter((x) => x.id === selected?.id)[0]?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="right-5 block w-full min-w-[300px] pr-0">
            <div className="flex w-full items-center space-x-2 px-4 py-2">
              <MonitorIcon size={20} className="text-muted-foreground" />
              <span>Local</span>
            </div>
            <div className="border-b border-border" />
            {downloadedModels.length === 0 ? (
              <div className="px-4 py-2">
                <p>{`Oops, you don't have a model yet.`}</p>
              </div>
            ) : (
              <SelectGroup>
                {downloadedModels.map((x, i) => (
                  <SelectItem
                    key={i}
                    value={x.id}
                    className={twMerge(x.id === selected?.id && 'bg-secondary')}
                  >
                    <div className="flex w-full justify-between">
                      <span className="line-clamp-1 block">{x.name}</span>
                      <span className="font-bold text-muted-foreground">
                        {toGigabytes(x.metadata.size)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            <div className="border-b border-border" />
            <div className="w-full px-4 py-2">
              <Button
                block
                className="bg-blue-100 font-bold text-blue-600 hover:bg-blue-100 hover:text-blue-600"
                onClick={() => setMainViewState(MainViewState.Hub)}
              >
                Explore The Hub
              </Button>
            </div>
          </SelectContent>
        </Select>
      </TooltipTrigger>

      {finishInit && (
        <TooltipContent sideOffset={10}>
          <span>Start a new thread to change the model</span>
          <TooltipArrow />
        </TooltipContent>
      )}

      {selected?.engine === InferenceEngine.openai && (
        <div className="mt-4">
          <label
            id="thread-title"
            className="mb-2 inline-block font-bold text-gray-600 dark:text-gray-300"
          >
            API Key
          </label>
          <Input
            id="assistant-instructions"
            placeholder="Enter your API_KEY"
            defaultValue={openAISettings?.api_key}
            onChange={(e) => {
              saveOpenAISettings({ apiKey: e.target.value })
            }}
          />
        </div>
      )}
    </Tooltip>
  )
}
