import React, { useState } from 'react'
import { BaseEventOrigFunction, Text, Slider, View } from "@tarojs/components"
import { SliderProps } from '@tarojs/components/types/Slider'
import DiskMenu from '@/components/disk-menu'
import { MenuItemProps } from '@/components/menu-item'

import './index.scss'

const getList: (num: number) => MenuItemProps[] = (num) => {
    const result: MenuItemProps[] = []
    for (let i = 0; i < num; i++) {
        result.push({
            defaultIcon: `${i}`,
            checkedIcon: `'${i}'`,
            label: `菜单${i}`
        })
    }
    return result
}

const totalInitival = 3

const IndexPage: React.FC = () => {

    const [total, setTotal] = useState<number>(totalInitival)

    const [list, setList] = useState<MenuItemProps[]>(getList(totalInitival))

    const handleSliderChange: BaseEventOrigFunction<SliderProps.onChangeEventDetail> = (eve) => {
        setTotal(eve.detail.value)
        setList(getList(eve.detail.value))
    }

    return (
        <View>
            <Text className='total-text'>当前菜单个数：{total}</Text>
            <Slider min={1} max={20} step={1} value={total} showValue onChange={handleSliderChange} />
            <DiskMenu list={list} />
        </View>
    )
}

export default IndexPage