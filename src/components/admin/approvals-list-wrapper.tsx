'use client'

import dynamic from 'next/dynamic'
import React from 'react'

export const ApprovalsListWrapper = dynamic(
    () => import('@/components/admin/approvals-list-client').then(mod => mod.ApprovalsListClient),
    {
        ssr: false,
        loading: () => (
            <div className="text-center py-12">
                <CustomSpinner className="h-8 w-8 animate-spin mx-auto text-gray-900" />
                <p className="mt-4 text-gray-500">Yükleniyor...</p>
            </div>
        )
    }
)
