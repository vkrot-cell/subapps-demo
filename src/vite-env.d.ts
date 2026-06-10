/// <reference types="vite/client" />
/// <reference types="trusted-types" />

interface Navigator {
    subApps?: {
        add(apps: List<string>): Promise<any>;
        remove(apps: List<string>): Promise<any>;
        list(): Promise<any>;
    }
}
