import React from 'react'
import { View, Text } from "@tarojs/components"

import './index.scss'

export interface Point {
    x: number,
    y: number
}

export interface MenuItemProps {
    defaultIcon: string,
    checkedIcon: string,
    label: string,
    checked?: boolean,
    translate?: Point
}

const MenuItem: React.FC<MenuItemProps> = ({ defaultIcon, checkedIcon, label, checked, translate }) => {
    checked = checked || false
    translate = translate || { x: 0, y: 0 }

    return (
        <View className='menu-item' style={{ transform: `translate(${translate.x - 60}rpx,${translate.y}rpx)` }}>
            <View className='menu-item-icon'>
                <Text style={{ color: checked ? 'green' : '#333333' }} >{checked ? checkedIcon : defaultIcon}</Text>
            </View>
            <Text className='menu-item-label' style={{ color: checked ? 'green' : '#333333' }}>{label}</Text>
        </View>
    )
}

export default MenuItem