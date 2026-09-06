import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LogoutConfirmationModal } from '../LogoutConfirmationModal'

describe('LogoutConfirmationModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <LogoutConfirmationModal
        isOpen={false}
        unsyncedCount={3}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders title and unsynced count when isOpen is true', () => {
    render(
      <LogoutConfirmationModal
        isOpen={true}
        unsyncedCount={3}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByText('Unsynced Changes Warning')).toBeInTheDocument()
    expect(screen.getByText(/3/)).toBeInTheDocument()
    expect(screen.getByText(/permanently discard these offline changes/)).toBeInTheDocument()
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(
      <LogoutConfirmationModal
        isOpen={true}
        unsyncedCount={2}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when Discard & Logout button is clicked', () => {
    const onConfirm = vi.fn()
    render(
      <LogoutConfirmationModal
        isOpen={true}
        unsyncedCount={5}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Discard & Logout' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
