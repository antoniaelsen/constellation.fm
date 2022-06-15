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


const getDeviceIcon = (type) => {
  const deviceIcons = {
    Computer: ComputerIcon,
    Smartphome: PhoneIphoneIcon,
    Speaker: SpeakerIcon,
  };
  return deviceIcons[type] || DevicesOtherIcon;
}


interface DeviceMenuInnerProps {
  anchorEl: null | HTMLElement;
  deviceId?: string | null;
  devices: any[];
  disabled?: boolean;
  open: boolean;
  volume: number;
  boxProps?: BoxProps;
  onDeviceClick: (deviceId: string) => void;
  onDeviceButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDeviceMenuClose: () => void;
  onVolume: (value: number) => void;
}

const DeviceMenuInner = forwardRef((props: DeviceMenuInnerProps, ref) => {
  const { anchorEl, boxProps, devices, disabled, open, volume, onVolume, onDeviceButtonClick, onDeviceClick, onDeviceMenuClose } = props;

  return (
    <StyledBox {...boxProps} ref={ref} sx={{ display: "flex", alignItems: "center", ...boxProps?.sx }}>
      <IconButton
        sx={{ minWidth: "32px" }}
        aria-label="Connect to device"
        color="info"
        disabled={disabled}
        onClick={onDeviceButtonClick}
      >
        <SpeakerGroupIcon/>
      </IconButton>
      <Popover
        id="spotify-playback-device-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={onDeviceMenuClose}
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
                <ListItemButton onClick={() => { onDeviceClick(id) }}>
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
})


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
    transferPlayback(id);
    handleDeviceMenuClose();
  }

  useEffect(() => {
    getAvailableDevices();
  }, []);

  const otherDevice = devices.find((device) => device.is_active && device.id !== deviceId);
  
  return (
    <Tooltip arrow open={!!otherDevice} placement="left" title={`Listening on ${otherDevice?.name}`}>
      <DeviceMenuInner
        anchorEl={anchorEl}
        boxProps={boxProps}
        devices={devices}
        disabled={disabled}
        open={open}
        volume={volume}
        onVolume={onVolume}
        onDeviceButtonClick={handleDeviceButtonClick}
        onDeviceClick={handleDeviceClick}
        onDeviceMenuClose={handleDeviceMenuClose}
      />
    </Tooltip>
  );
}
