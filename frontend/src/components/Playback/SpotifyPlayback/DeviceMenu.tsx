import React, { useEffect, useRef, useState } from "react";
import { BoxProps, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Popover, Tooltip } from "@mui/material";
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
      <StyledBox {...boxProps} sx={{ display: "flex", alignItems: "center", ...boxProps?.sx }}>
          <Button
            sx={{ minWidth: "32px", mr: 2 }}
            aria-label="Connect to device"
            color="info"
            size="small"
            disabled={disabled}
            onClick={handleDeviceButtonClick}
          >
            <SpeakerGroupIcon fontSize="medium" />
          </Button>
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
    </Tooltip>
  );
}
