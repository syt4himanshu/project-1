import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PhotoAvatar } from './PhotoAvatar'

describe('PhotoAvatar', () => {
  it('renders the image when the url is valid', () => {
    render(
      <PhotoAvatar
        url="https://res.cloudinary.com/demo/image/upload/v1/students/avatar.jpg"
        alt="Student profile"
        className="avatar"
        fallback={<span>AB</span>}
      />,
    )

    expect(screen.getByRole('img', { name: /student profile/i })).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/demo/image/upload/v1/students/avatar.jpg',
    )
  })

  it('falls back when the image fails to load', () => {
    render(
      <PhotoAvatar
        url="https://res.cloudinary.com/demo/image/upload/v1/students/broken.jpg"
        alt="Student profile"
        className="avatar"
        fallback={<span>AB</span>}
      />,
    )

    fireEvent.error(screen.getByRole('img', { name: /student profile/i }))

    expect(screen.getByText('AB')).toBeInTheDocument()
  })
})
