import { RendererElement, RendererNode, VNode } from 'vue'

export interface Collapse {
    icon: VNode<RendererNode, RendererElement, { [key: string]: any }>
    name: string
    title: string
    columns?: TableColumn[]
  }

export type ListImages = 'text' | 'picture' | 'picture-card'

export interface IStatusHistory {
  statusName: string
  statusValue: number
  approvedAt: string
  isActive: boolean
}