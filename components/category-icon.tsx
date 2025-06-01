"use client" // Not strictly necessary for this component if it only renders icons, but good practice if it might evolve.

import * as LucideIcons from "lucide-react"

// Defines the type for icon names based on the keys of LucideIcons
type IconName = keyof typeof LucideIcons

// Props for the CategoryIcon component:
// - name: The string name of the Lucide icon to render.
// - Other props are spread onto the Lucide icon component (e.g., className, size).
interface CategoryIconProps extends LucideIcons.LucideProps {
  name: string
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  // Dynamically get the Icon component from LucideIcons based on the name.
  // It's cast to LucideIcons.LucideIcon for type safety.
  const IconComponent = LucideIcons[name as IconName] as LucideIcons.LucideIcon

  // If the icon name doesn't correspond to a valid Lucide icon,
  // render a fallback icon (HelpCircle in this case).
  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />
  }

  // Render the dynamically selected icon component with the provided props.
  return <IconComponent {...props} />
}
