"use client"

import { DefaultCell, useListDrawerContext } from "@payloadcms/ui"
import type { DefaultCellComponentProps } from "payload"
import { mediaUrl } from "@/lib/people"
import { AvatarBadge } from "./avatar-badge"

// The Name column of the Users table: photo + name.
//
// It wraps Payload's own DefaultCell so the column still links to the account.
// A custom cell bypasses the wrapper that, inside a "choose a user" drawer,
// turns the first column's link into "select this row", so that part is
// repeated here.
export function UserNameCell(props: DefaultCellComponentProps) {
  const { drawerSlug, onSelect } = useListDrawerContext()
  const row = (props.rowData ?? {}) as { id?: string; name?: string | null; email?: string | null; avatar?: unknown }
  const label = (typeof props.cellData === "string" && props.cellData.trim()) || row.email || "Unnamed"

  const cellProps: DefaultCellComponentProps = { ...props, cellData: label }
  if (drawerSlug && props.link !== false) {
    cellProps.link = false
    cellProps.onClick = ({ collectionSlug, rowData }) => {
      if (typeof onSelect === "function") onSelect({ collectionSlug, doc: rowData, docID: rowData.id })
    }
  }

  return (
    <div className="mstack-person-cell">
      <AvatarBadge name={label} url={mediaUrl(row.avatar)} size="sm" />
      <DefaultCell {...cellProps} />
    </div>
  )
}
