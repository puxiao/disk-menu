import React, { useEffect, useState } from 'react'
import { ITouchEvent, View } from "@tarojs/components"
import MenuItem, { MenuItemProps, Point } from '@/components/menu-item'

import './index.scss'

export interface DiskMenuProps {
    list: MenuItemProps[]
    checked?: number,
    width?: number,
}

const getDiskPoints: (diameter: number) => Point[] = (diameter) => {

    const result: Point[] = []

    //位置数量，这里假定圆盘有10个位置，也可以更改为其他数量，但是为了对称，数量一定要是偶数
    const count = 10

    //半径，同时也是圆心的位置
    const radius = Math.floor(diameter / 2)

    //弧度，圆盘有 count 个位置，但是由于圆盘最左或最右侧的位置被水平线分割，因此实际上要将圆划分为 count * 2 个单位
    const radian = (360 / (count * 2)) * Math.PI / 180

    /* 
      开始计算位置，7个位置分别是：
      1、最左侧位于水平线下面的位置(左侧消失点)
      2、最左侧位于水平线上面的位置(左侧显示点)
      3、左侧偏上的位置
      4、顶部正中间的位置
      5、右侧偏上的位置
      6、最右侧位于水平线上面的位置(右侧显示点)
      7、最右侧位于水平线下面的位置(右侧消失点)
     */
    for (let i = 0; i < 7; i++) {

        //假设我们是按照传统数学中四相坐标系来计算，当前位置对应在圆上的弧度
        const nowRadian = Math.PI / 180 - radian * (i * 2 - 1)

        //根据所在弧度，计算出当前位置的坐标
        const x = Math.floor(radius + radius * Math.cos(nowRadian))
        const y = Math.floor(radius + radius * Math.sin(nowRadian))

        //请注意，上面的坐标位置是按照从右侧开始向左侧计算，而我们的视图逻辑希望从左侧开始作为起始点
        //因此需要将得到的结果插入到数组开头，而不是数组结尾，这样越靠后计算出的位置越在数组前面
        result.unshift({ x, y })
    }

    return result
}

const getTranslates = (points: Point[], total: number, first: number): Point[] => {
    const result: Point[] = []
    if (total === 1) {
        result.push(points[3])
    } else if (total === 2) {
        result.push(points[2])
        result.push(points[4])
    } else if (total === 3) {
        result.push(points[2])
        result.push(points[3])
        result.push(points[4])
    } else if (total === 4) {
        result.push(points[1])
        result.push(points[2])
        result.push(points[4])
        result.push(points[5])
    } else if (total >= 5) {
        for (let i = 0; i < total; i++) {
            result.push(points[i < 5 + first ? Math.max(i + 1 - first, 0) : 6])
        }
    }
    return result
}

let oldX = 0
let oldFirst = 0

const DiskMenu: React.FC<DiskMenuProps> = ({ width, list, checked }) => {
    width = width || 580
    checked = checked || -1 //-1表示未选中任何项

    const points = getDiskPoints(width)

    const [first, setFirst] = useState<number>(0)
    const [translates, setTranslates] = useState<Point[]>([])

    useEffect(() => {
        setFirst(0)
        setTranslates(getTranslates(points, list.length, 0))
    }, [list])

    const handleOnTouchStart = (eve: ITouchEvent) => {
        oldX = eve.touches[0].clientX
        oldFirst = first
    }

    const handleOnTouchMove = (eve: ITouchEvent) => {
        let new_first = oldFirst + Math.floor((oldX - eve.touches[0].clientX) / 50)
        new_first = Math.max(new_first, 0)
        new_first = Math.min(new_first, list.length - 5)
        setFirst(new_first)
        setTranslates(getTranslates(points, list.length, new_first))
    }

    return (
        <View className='disk-menu-core'
            style={{ width: `${width}rpx`, height: `${width / 2}rpx`, left: `${(750 - width) / 2}rpx` }}
            onTouchStart={handleOnTouchStart} onTouchMove={handleOnTouchMove}>
            {
                list.map((item, index) => {
                    return <MenuItem {...item} translate={translates[index]} />
                })
            }
        </View >
    )
}

export default DiskMenu