import type { Block, NodePosition, EdgePath, LayoutResult } from '@/types'

export function calculateLayout(
  blocks: Block[],
  options: {
    nodeWidth?: number
    nodeHeight?: number
    verticalGap?: number
    canvasWidth?: number
  } = {}
): LayoutResult {
  const {
    nodeWidth = 280,
    nodeHeight = 100,
    verticalGap = 80,
    canvasWidth = 400
  } = options

  const nodes: NodePosition[] = []
  const edges: EdgePath[] = []

  // Single column layout
  blocks.forEach((block, index) => {
    const x = (canvasWidth - nodeWidth) / 2
    const y = index * (nodeHeight + verticalGap)

    nodes.push({
      blockId: block.id,
      x,
      y,
      width: nodeWidth,
      height: nodeHeight
    })

    // Draw edge to next block
    if (index < blocks.length - 1) {
      const currentY = y + nodeHeight
      const nextY = y + nodeHeight + verticalGap

      const centerX = x + nodeWidth / 2
      const controlY = currentY + verticalGap / 2

      const pathD = `M ${centerX} ${currentY} C ${centerX} ${controlY}, ${centerX} ${controlY}, ${centerX} ${nextY}`

      edges.push({
        from: block.id,
        to: blocks[index + 1].id,
        d: pathD
      })
    }
  })

  const totalHeight = blocks.length * (nodeHeight + verticalGap)

  return { nodes, edges, totalHeight }
}

export function getPriorityColor(priority: string): string {
  const colors = {
    normal: '#9CA3AF',
    alta: '#F59E0B',
    maxima: '#A855F7'
  }
  return colors[priority as keyof typeof colors] || colors.normal
}

export function getProgressPercentColor(percent: number): string {
  if (percent < 33) return '#EF4444'
  if (percent < 66) return '#F59E0B'
  return '#22C55E'
}
