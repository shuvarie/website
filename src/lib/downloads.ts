/**
 * Release downloads.
 *
 * The site is prerendered with `adapter-static`, so nothing here runs on a
 * server: `DownloadButton` detects the platform from `onMount` and reads the
 * latest release straight from the public GitHub API (CORS-open, no token).
 *
 * Asset names come from `.github/workflows/release.yml` in the product repo:
 *
 *   shuvarie-0.6.0-x86_64-unknown-linux-gnu.tar.gz
 *   shuvarie_0.6.0_amd64.deb
 *   shuvarie-setup-0.6.0-amd64.exe
 *
 * They are parsed instead of hard-coded, so a package format added to a future
 * release shows up in the menu without a change here.
 */

export const REPO_URL = 'https://github.com/shuvarie/shuvarie';
export const RELEASES_URL = `${REPO_URL}/releases`;
export const LATEST_RELEASES_URL = `${RELEASES_URL}/latest`;

const LATEST_RELEASE_API = 'https://api.github.com/repos/shuvarie/shuvarie/releases/latest';
const CHECKSUMS_NAME = 'SHA256SUMS';

export type Os = 'linux' | 'macos' | 'windows';

export type Arch = 'x86_64' | 'aarch64';

/** A build the browser can be matched against. */
export type Target = {
	triple: string;
	os: Os;
	arch: Arch;
	/** The archive the target is published as by default. */
	ext: 'tar.gz' | 'zip';
	/** Short platform name for the download button, e.g. `linux x86_64`. */
	label: string;
};

export const TARGETS: readonly Target[] = [
	{
		triple: 'x86_64-unknown-linux-gnu',
		os: 'linux',
		arch: 'x86_64',
		ext: 'tar.gz',
		label: 'linux x86_64'
	},
	{
		triple: 'aarch64-unknown-linux-gnu',
		os: 'linux',
		arch: 'aarch64',
		ext: 'tar.gz',
		label: 'linux aarch64'
	},
	{
		triple: 'x86_64-apple-darwin',
		os: 'macos',
		arch: 'x86_64',
		ext: 'tar.gz',
		label: 'macos x86_64'
	},
	{
		triple: 'aarch64-apple-darwin',
		os: 'macos',
		arch: 'aarch64',
		ext: 'tar.gz',
		label: 'macos arm64'
	},
	{
		triple: 'x86_64-pc-windows-gnullvm',
		os: 'windows',
		arch: 'x86_64',
		ext: 'zip',
		label: 'windows x86_64'
	},
	{
		triple: 'aarch64-pc-windows-gnullvm',
		os: 'windows',
		arch: 'aarch64',
		ext: 'zip',
		label: 'windows arm64'
	}
];

export const OS_LABELS: Record<Os, string> = {
	linux: 'linux',
	macos: 'macos',
	windows: 'windows'
};

/** One file attached to a release. */
export type Asset = {
	name: string;
	url: string;
	size: number;
	os: Os | 'other';
	arch: Arch | null;
	/** What the file is once product, platform and version noise are gone: `x86_64 gnu`. */
	label: string;
	/** Packaging: `tar.gz`, `zip`, `deb`, `rpm`, `exe`. */
	format: string;
};

export type Release = {
	tag: string;
	version: string;
	/** The human-readable release page on GitHub. */
	page: string;
	assets: Asset[];
};

/** The order a target's formats are offered in the menu. */
const FORMAT_ORDER = ['tar.gz', 'zip', 'dmg', 'deb', 'rpm', 'exe', 'msi'];

/** Extensions long enough that a naive `split('.')` would cut them short. */
const EXTENSIONS = ['.tar.gz', '.tar.xz', '.tar.bz2', '.zip', '.dmg', '.deb', '.rpm', '.exe', '.msi'];

/** Tokens that say nothing about which build a file is. */
const NOISE = new Set([
	'shuvarie',
	'setup',
	'installer',
	'unknown',
	'pc',
	'apple',
	'darwin',
	'linux',
	'windows',
	'win',
	'macos'
]);

/**
 * Splits a release asset name into the parts the menu needs.
 *
 * `shuvarie-0.6.0-aarch64-unknown-linux-musl.tar.gz`
 *   → label `aarch64 musl`, format `tar.gz`, os `linux`
 */
export function describeAsset(name: string, url: string, size: number): Asset {
	if (name === CHECKSUMS_NAME) {
		return { name, url, size, os: 'other', arch: null, label: 'checksums', format: 'txt' };
	}

	const format = EXTENSIONS.find((ext) => name.endsWith(ext))?.slice(1) ?? '';
	const stem = (format ? name.slice(0, -(format.length + 1)) : name).toLowerCase();

	// `x86_64` is the one arch token with an underscore, and the packaging
	// names spell it `amd64`/`x64` — collapse every alias into one separator-free
	// token first, since the split below cuts on `-`, `_` and `.`.
	const tokens = stem
		.replace(/x86_64|amd64|x64/g, 'x8664')
		.replace(/aarch64|arm64/g, 'aarch64')
		.split(/[-_.\s]+/)
		.filter(Boolean);

	const arch: Arch | null = tokens.includes('x8664')
		? 'x86_64'
		: tokens.includes('aarch64')
			? 'aarch64'
			: null;

	const os: Os | 'other' =
		tokens.includes('darwin') || format === 'dmg'
			? 'macos'
			: tokens.includes('windows') || format === 'exe' || format === 'msi'
				? 'windows'
				: tokens.includes('linux') || format === 'deb' || format === 'rpm'
					? 'linux'
					: 'other';

	// Whatever survives is the interesting part: gnu, musl, gnullvm — plus the
	// version and arch tokens, which are dropped.
	const flavour = tokens
		.filter(
			(token) =>
				!NOISE.has(token) &&
				token !== 'x8664' &&
				token !== 'aarch64' &&
				!/^\d+$/.test(token)
		)
		.join(' ');

	const label = [arch, flavour].filter((part) => Boolean(part)).join(' ') || format || 'file';

	return { name, url, size, os, arch, label, format };
}

export type AssetGroup = { os: Os; label: string; assets: Asset[] };

/** Assets grouped for the menu, most common platform and format first. */
export function groupAssets(assets: readonly Asset[]): AssetGroup[] {
	const rank = (format: string) => {
		const index = FORMAT_ORDER.indexOf(format);
		return index === -1 ? FORMAT_ORDER.length : index;
	};

	return (Object.keys(OS_LABELS) as Os[])
		.map((os) => ({
			os,
			label: OS_LABELS[os],
			assets: assets
				.filter((asset) => asset.os === os)
				.sort(
					(a, b) =>
						rank(a.format) - rank(b.format) ||
						Number(b.arch === 'x86_64') - Number(a.arch === 'x86_64') ||
						a.label.localeCompare(b.label)
				)
		}))
		.filter((group) => group.assets.length > 0);
}

/** The file this browser should get: the exact archive, else the closest match. */
export function assetFor(release: Release, target: Target): Asset | null {
	const exact = `shuvarie-${release.version}-${target.triple}.${target.ext}`;

	return (
		release.assets.find((asset) => asset.name === exact) ??
		release.assets.find(
			(asset) =>
				asset.os === target.os && asset.arch === target.arch && asset.format === target.ext
		) ??
		release.assets.find((asset) => asset.os === target.os && asset.arch === target.arch) ??
		null
	);
}

type ApiAsset = { name?: unknown; browser_download_url?: unknown; size?: unknown };
type ApiRelease = { tag_name?: unknown; html_url?: unknown; assets?: unknown };

/** Latest published (non-draft, non-prerelease) release, as GitHub reports it. */
export async function fetchLatestRelease(): Promise<Release> {
	const response = await fetch(LATEST_RELEASE_API, {
		headers: { Accept: 'application/vnd.github+json' }
	});
	if (!response.ok) {
		throw new Error(`GitHub answered ${response.status} for the latest release`);
	}

	const data = (await response.json()) as ApiRelease;
	const tag = typeof data.tag_name === 'string' ? data.tag_name : '';
	const assets = Array.isArray(data.assets) ? (data.assets as ApiAsset[]) : [];

	return {
		tag: tag || 'latest',
		version: tag.replace(/^v/, ''),
		page: typeof data.html_url === 'string' ? data.html_url : LATEST_RELEASES_URL,
		assets: assets.flatMap((asset) => {
			if (typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string') {
				return [];
			}
			return [
				describeAsset(
					asset.name,
					asset.browser_download_url,
					typeof asset.size === 'number' ? asset.size : 0
				)
			];
		})
	};
}

type UaData = {
	platform?: string;
	getHighEntropyValues?: (
		hints: string[]
	) => Promise<{ platform?: string; architecture?: string; bitness?: string }>;
};

/**
 * Chrome and Edge expose the CPU architecture behind an async call; Safari and
 * Firefox expose neither, so the user agent is the fallback.
 */
async function clientHints(): Promise<{ platform?: string; architecture?: string; bitness?: string }> {
	const uaData = (navigator as unknown as { userAgentData?: UaData }).userAgentData;
	if (!uaData) return {};
	if (typeof uaData.getHighEntropyValues !== 'function') return { platform: uaData.platform };

	try {
		return await uaData.getHighEntropyValues(['platform', 'architecture', 'bitness']);
	} catch {
		return { platform: uaData.platform };
	}
}

function detectOs(platformHint: string | undefined): Os | null {
	const ua = navigator.userAgent.toLowerCase();
	const touchPoints = navigator.maxTouchPoints ?? 0;

	// No release target exists for phones and tablets: they report themselves as
	// Linux (Android) or, for iPads, as a Mac.
	if (/iphone|ipad|ipod|android/.test(ua)) return null;
	if (/mac/.test(ua) && touchPoints > 1) return null;

	const hint = (platformHint ?? '').toLowerCase();
	if (hint.includes('win')) return 'windows';
	if (hint.includes('mac')) return 'macos';
	if (hint.includes('chrome os') || hint.includes('chromium os') || hint.includes('cros')) {
		return 'linux';
	}
	if (hint.includes('linux')) return 'linux';

	if (/windows|win64|win32/.test(ua)) return 'windows';
	if (/mac os x|macintosh/.test(ua)) return 'macos';
	if (/linux|x11|cros/.test(ua)) return 'linux';

	return null;
}

function detectArch(os: Os, archHint: string | undefined, bitness: string | undefined): Arch | null {
	// Nothing 32-bit is published, and neither is 32-bit ARM.
	if (bitness === '32') return null;

	const hint = (archHint ?? '').toLowerCase();
	if (hint === 'arm') return 'aarch64';
	if (hint === 'x86') return 'x86_64';

	const probe = `${navigator.platform ?? ''} ${navigator.userAgent}`.toLowerCase();
	if (/armv[5-7]|armhf/.test(probe)) return null;
	if (/aarch64|arm64|armv8/.test(probe)) return 'aarch64';
	if (/i[3-6]86/.test(probe)) return null;
	if (os === 'windows' && !/win64|x64|amd64|wow64/.test(probe)) return null;

	// Safari and Firefox keep an Intel user agent on Apple Silicon, where newer
	// hardware is by far the common case; the menu has the other build anyway.
	if (os === 'macos') return 'aarch64';

	return 'x86_64';
}

/**
 * The build matching the browser, or `null` when the platform is unsupported
 * (phones, tablets, 32-bit or BSD) — the menu still lists every release file.
 */
export async function detectTarget(): Promise<Target | null> {
	if (typeof navigator === 'undefined') return null;

	const hints = await clientHints();
	const os = detectOs(hints.platform);
	if (!os) return null;

	const arch = detectArch(os, hints.architecture, hints.bitness);
	if (!arch) return null;

	return TARGETS.find((target) => target.os === os && target.arch === arch) ?? null;
}
