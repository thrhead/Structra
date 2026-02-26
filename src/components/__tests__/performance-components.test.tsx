import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobDetailsView } from '../job-details-view'
import { JobTimeline } from '../charts/job-timeline'

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />
  },
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

const mockJob = {
  id: 'test-job-id',
  jobNo: 'JOB-123',
  title: 'Test Job',
  description: 'Test Description',
  status: 'IN_PROGRESS',
  priority: 'MEDIUM',
  location: 'Test Location',
  createdAt: new Date(),
  customer: {
    company: 'Test Customer',
    user: { name: 'Customer Name', email: 'customer@test.com', phone: '555-1234' }
  },
  assignments: [],
  steps: [
    {
      id: 'step-1',
      title: 'Step 1',
      isCompleted: true,
      completedAt: new Date(),
      order: 1,
      completedBy: { name: 'Worker Name' },
      photos: [
        { id: 'photo-1', url: '/test-photo.jpg', uploadedAt: new Date(), uploadedBy: { name: 'Worker Name' } }
      ]
    }
  ]
}

describe('Performance Optimized Components', () => {
  describe('JobDetailsView', () => {
    it('should render successfully with mocked Image component', () => {
      render(<JobDetailsView job={mockJob as any} />)
      expect(screen.getByText('Test Job')).toBeDefined()
      // Use getAllByText because it appears in Project No and Step No
      expect(screen.getAllByText(/JOB-123/).length).toBeGreaterThan(0)
    })
  })

  describe('JobTimeline', () => {
    it('should render successfully and handle Image alias correctly', () => {
      const timelineSteps = mockJob.steps.map(s => ({
        ...s,
        startedAt: new Date(),
        blockedAt: null,
        blockedReason: null
      }))
      
      render(<JobTimeline steps={timelineSteps as any} jobId="test-job-id" />)
      expect(screen.getByText('Step 1')).toBeDefined()
    })
  })
})
