import { DeviceType } from '$lib/types/music';
import type { Device } from '$lib/types/music';

export const MOCK_DEVICES: Device[] = [
	{
		id: '1',
		name: 'iPhone 15 Pro',
		type: DeviceType.SMARTPHONE,
		isVolumeSupported: true,
		volume: 75,
		isRestricted: false,
		isActive: true
	},
	{
		id: '2',
		name: 'MacBook Pro',
		type: DeviceType.COMPUTER,
		isVolumeSupported: true,
		volume: 50,
		isRestricted: false,
		isActive: false
	},
	{
		id: '3',
		name: 'HomePod Mini',
		type: DeviceType.SPEAKER,
		isVolumeSupported: true,
		volume: 60,
		isRestricted: false,
		isActive: false
	},
	{
		id: '4',
		name: 'Restricted Device',
		type: DeviceType.SPEAKER,
		isVolumeSupported: false,
		volume: 0,
		isRestricted: true,
		isActive: false
	}
];
