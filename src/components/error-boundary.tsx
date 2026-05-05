'use client'

import React, { Component, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RotateCcw } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error boundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <Card className="m-4 border-destructive/20 shadow-sm">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-destructive/10 p-3">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                        </div>
                        <CardTitle className="text-xl">Bir şeyler yanlış gitti</CardTitle>
                        <CardDescription>
                            Bu bileşen yüklenirken bir hata oluştu.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-2">
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Alert variant="destructive" className="mb-2 text-left">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Hata Detayı</AlertTitle>
                                <AlertDescription className="font-mono text-xs break-all mt-2">
                                    {this.state.error.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>

                    <CardFooter className="justify-center pt-2">
                        <Button
                            onClick={() => this.setState({ hasError: false })}
                            variant="outline"
                            className="gap-2 w-full sm:w-auto"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Tekrar Dene
                        </Button>
                    </CardFooter>
                </Card>
            )
        }

        return this.props.children
    }
}
