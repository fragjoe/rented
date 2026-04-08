'use client'

import { useState } from 'react'
import { addInvoiceItem } from '@/lib/db/actions'

interface InvoiceItemFormProps {
  invoiceId: string
}

export function InvoiceItemForm({ invoiceId }: InvoiceItemFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unitPrice, setUnitPrice] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    await addInvoiceItem(invoiceId, {
      description,
      quantity: parseFloat(quantity) || 1,
      unit_price: parseFloat(unitPrice) || 0,
    })
    setIsLoading(false)
    setDescription('')
    setQuantity('1')
    setUnitPrice('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <label className="form-label text-xs">Deskripsi</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
          placeholder="Biaya sewa"
        />
      </div>
      <div className="w-20">
        <label className="form-label text-xs">Qty</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="form-input"
          min="1"
        />
      </div>
      <div className="w-28">
        <label className="form-label text-xs">Harga</label>
        <input
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          className="form-input"
          placeholder="0"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !description || !unitPrice}
        className="px-3 py-2 bg-primary text-white text-sm rounded-lg disabled:opacity-50"
      >
        {isLoading ? '...' : '+ Tambah'}
      </button>
    </form>
  )
}
