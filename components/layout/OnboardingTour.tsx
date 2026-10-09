'use client'

import { useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export function OnboardingTour() {
  useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined') return

    const hasSeenTour = localStorage.getItem('ktu_has_seen_tour')
    if (hasSeenTour) return

    // Initialize driver
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayOpacity: 0.6,
      popoverClass: 'ktu-driver-popover',
      steps: [
        {
          element: '#nav-dashboard',
          popover: {
            title: 'Your Dashboard',
            description: 'Check your live CGPA, the exact countdown to your next exam, and urgent alerts in one place.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#nav-results',
          popover: {
            title: 'Instant Grades',
            description: 'No more dropdowns. Instantly view your latest semester grades with clear visual indicators.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#nav-exams',
          popover: {
            title: 'Chronological Schedule',
            description: 'Find an organized schedule of your upcoming exams, plus quick links for registration.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#theme-toggle',
          popover: {
            title: 'Theme Selection',
            description: 'Swap between the vibrant Default Blue and the calming Sage Green themes.',
            side: 'bottom',
            align: 'end'
          }
        }
      ],
      onDestroyed: () => {
        localStorage.setItem('ktu_has_seen_tour', 'true')
      }
    })

    // Start the tour
    // Slight delay to ensure elements are mounted and animated in
    const timer = setTimeout(() => {
      driverObj.drive()
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return null
}
