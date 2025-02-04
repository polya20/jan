/* eslint-disable no-case-declarations */
import { FieldValues, UseFormRegister } from 'react-hook-form'

import Checkbox from '@/containers/Checkbox'
import Slider from '@/containers/Slider'

export type ControllerType = 'slider' | 'checkbox'

export type SettingComponentData = {
  name: string
  title: string
  description: string
  controllerType: ControllerType
  controllerData: SliderData | CheckboxData
}

export type SliderData = {
  min: number
  max: number
  step: number
  value: number
}

type CheckboxData = {
  checked: boolean
}

const settingComponentBuilder = (
  componentData: SettingComponentData[],
  register: UseFormRegister<FieldValues>
) => {
  const components = componentData.map((data) => {
    switch (data.controllerType) {
      case 'slider':
        const { min, max, step, value } = data.controllerData as SliderData
        return (
          <Slider
            key={data.name}
            title={data.title}
            min={min}
            max={max}
            step={step}
            value={value}
            name={data.name}
            register={register}
          />
        )
      case 'checkbox':
        const { checked } = data.controllerData as CheckboxData
        return (
          <Checkbox
            key={data.name}
            register={register}
            name={data.name}
            title={data.title}
            checked={checked}
          />
        )
      default:
        return null
    }
  })

  return <div className="flex flex-col gap-y-4">{components}</div>
}

export default settingComponentBuilder
