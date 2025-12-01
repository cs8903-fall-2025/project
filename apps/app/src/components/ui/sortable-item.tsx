import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export function SortableItem(
  props: React.ComponentProps<'div'> & {
    id: string
  },
) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-start">
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing mt-2"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-1">{props.children}</div>
    </div>
  )
}
