'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-destructive/10 p-4">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">Hata!</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Bir şeyler yanlış gitti
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                    <p className="text-center text-muted-foreground mb-6">
                        Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <Alert variant="destructive" className="mb-4 text-left">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Hata Detayı</AlertTitle>
                            <AlertDescription className="font-mono text-xs break-all mt-2">
                                {error.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                <CardFooter>
                    <Button onClick={reset} className="w-full gap-2" size="lg">
                        <RotateCcw className="h-4 w-4" />
                        Tekrar Dene
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
