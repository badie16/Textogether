import * as Y from "yjs"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Awareness } from "y-protocols/awareness"

// Options for the Supabase provider
interface SupabaseProviderOptions {
  awareness?: boolean
  sync?: boolean
}

/**
 * Custom provider that syncs Yjs updates through Supabase Realtime
 */
export class SupabaseProvider {
  doc: Y.Doc
  supabase: SupabaseClient
  channel: any
  awareness: Awareness
  documentName: string
  synced = false
  wsconnected = false

  constructor(
    documentName: string,
    doc: Y.Doc,
    supabase: SupabaseClient,
    { awareness = false, sync = true }: SupabaseProviderOptions = {},
  ) {
    this.doc = doc
    this.supabase = supabase
    this.documentName = documentName
    this.awareness = new Awareness(doc)

    // Create a Supabase Realtime channel
    this.channel = this.supabase.channel(`document-${documentName}`, {
      config: {
        broadcast: {
          self: false,
        },
      },
    })

    // Listen for document updates
    this.channel.on("broadcast", { event: "document-update" }, (payload: any) => {
      const update = new Uint8Array(Object.values(payload.update))
      Y.applyUpdate(this.doc, update)
    })

    // Listen for awareness updates
    if (awareness) {
      this.channel.on("broadcast", { event: "awareness-update" }, (payload: any) => {
        this.awareness.applyUpdate(new Uint8Array(Object.values(payload.update)))
      })

      // Handle awareness changes
      this.awareness.on("update", this._awarenessUpdate.bind(this))
    }

    // Subscribe to the channel
    this.channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        this.wsconnected = true

        // If sync is enabled, send document state
        if (sync) {
          this._syncDocument()
        }
      } else {
        this.wsconnected = false
      }
    })

    // If sync is enabled, handle document updates
    if (sync) {
      this.doc.on("update", this._documentUpdate.bind(this))
    }
  }

  // Handle awareness updates
  _awarenessUpdate(changes: any) {
    if (this.wsconnected && changes.added.length + changes.updated.length > 0) {
      const awarenessUpdate = this.awareness.getStates()
      this.channel.send({
        type: "broadcast",
        event: "awareness-update",
        update: Array.from(Y.encodeStateAsUpdate(awarenessUpdate)),
      })
    }
  }

  // Handle document updates
  _documentUpdate(update: Uint8Array, origin: any) {
    if (origin !== this && this.wsconnected) {
      this.channel.send({
        type: "broadcast",
        event: "document-update",
        update: Array.from(update),
      })
    }
  }

  // Sync document with other clients
  _syncDocument() {
    if (this.wsconnected && !this.synced) {
      // Send initial document state
      const currentState = Y.encodeStateAsUpdate(this.doc)
      this.channel.send({
        type: "broadcast",
        event: "document-update",
        update: Array.from(currentState),
      })
      this.synced = true
    }
  }

  // Clean up resources
  destroy() {
    this.supabase.removeChannel(this.channel)
    this.awareness.destroy()
    this.doc.off("update", this._documentUpdate.bind(this))
  }
}
