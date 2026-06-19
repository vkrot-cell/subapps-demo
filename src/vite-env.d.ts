/// <reference types="vite/client" />
/// <reference types="trusted-types" />

interface SubAppsListResult {
    appName: string;
}

interface SubAppsAddResponse {
    installedApps: Record<string, string>;
    failedApps: Record<string, DOMException>;
}

interface SubAppsRemoveResponse {
    removedApps: string[];
    failedApps: Record<string, DOMException>;
}

interface SubApps {
    add(install_urls: string[]): Promise<SubAppsAddResponse>;
    remove(manifest_ids: string[]): Promise<SubAppsRemoveResponse>;
    list(): Promise<Record<string, SubAppsListResult>>;
}

interface Window {
    subApps?: SubApps;
}
