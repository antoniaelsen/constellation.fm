import React, { forwardRef, useEffect } from "react";
import {
  BoxProps,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Tooltip
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SpeakerIcon from "@mui/icons-material/Speaker";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";

import { StyledBox } from "components/StyledBox";
import { VolumeSlider } from "../VolumeSlider";


export interface Device {
  id: string;
  is_active: boolean;
  name: string;
  type: string;
}

const getDeviceIcon = (type) => {
  const deviceIcons = {
    Computer: ComputerIcon,
    Smartphome: PhoneIphoneIcon,
    Speaker: SpeakerIcon,
  };
  return deviceIcons[type] || DevicesOtherIcon;
}

interface DeviceMenuProps {
  deviceId?: string | null;
  devices: any[];
  disabled?: boolean;
  volume: number;
  boxProps?: BoxProps;
  getAvailableDevices: () => {};
  transferPlayback: (deviceId: string) => void;
  onVolume: (value: number) => void;
}

export const DeviceMenu = (props: DeviceMenuProps) => {
  const { boxProps, deviceId, devices, disabled, volume, onVolume, getAvailableDevices, transferPlayback } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleDeviceButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getAvailableDevices();
    setAnchorEl(event.currentTarget);
  };
  const handleDeviceMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeviceClick = (id: string) => {
    console.log("DeviceMenu | Transferring Playback to", id);
    transferPlayback(id);
    handleDeviceMenuClose();
  }

  useEffect(() => {
    getAvailableDevices();
  }, [getAvailableDevices]);

  const otherDevice = devices.find((device) => device.is_active && device.id !== deviceId);
  console.log("DeviceMenu | devices", !!otherDevice, otherDevice?.name, otherDevice)
  
  return (
    <StyledBox {...boxProps} sx={{ display: "flex", alignItems: "center", ...boxProps?.sx }}>
      <IconButton
        sx={{ minWidth: "32px" }}
        aria-label="Connect to device"
        color="info"
        disabled={disabled}
        onClick={handleDeviceButtonClick}
      >
        <Tooltip arrow open={!!otherDevice} placement="left" title={`Listening on ${otherDevice?.name}`}>
          <SpeakerGroupIcon/>
        </Tooltip>
      </IconButton>
      <Popover
        id="spotify-playback-device-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleDeviceMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <List
          disablePadding
          subheader={<ListSubheader>Connect to a device</ListSubheader>}
        >
          {devices.map((device) => {
            const { id, is_active: isActive, name, type } = device;
            const IconComponent = getDeviceIcon(type);
            return (
              <ListItem key={id} disablePadding>
                <ListItemButton onClick={() => { handleDeviceClick(id) }}>
                  <ListItemIcon color={isActive ? "primary" : "default"}>
                    <IconComponent/>
                  </ListItemIcon>
                  <ListItemText primary={name} color={isActive ? "primary" : "default"}/>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Popover>

      <VolumeSlider disabled={disabled} value={volume} onVolume={onVolume}/>
    </StyledBox>
  );
}
