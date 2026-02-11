/// <reference types="vite/client" />
/// <reference types="trusted-types" />

interface Navigator {
    subApps?: {
        add(apps: Record<string, { installURL: string }>): any;
    }
}
