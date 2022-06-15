import React, { useEffect, useRef, useState } from "react";
import { BoxProps, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Popover } from "@mui/material";
import { styled } from "@mui/material/styles";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SpeakerIcon from "@mui/icons-material/Speaker";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import SpeakerGroupIcon from "@mui/icons-material/SpeakerGroup";

import config from "config";
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
  disabled?: boolean;
  volume: number;
  boxProps?: BoxProps;
  onVolume: (value: number) => void;
}

export const DeviceMenu = (props: DeviceMenuProps) => {
  const { boxProps, disabled, volume, onVolume } = props;

  const [devices, setDevices] = useState<any>([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleDeviceButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getAvailableDevices();
    setAnchorEl(event.currentTarget);
  };
  const handleDeviceMenuClose = () => {
    setAnchorEl(null);
  };

  const getAvailableDevices = async () => {
    try {
      const res = await fetch(`${config.api.spotify}/me/player/devices`, { credentials: "include" }).then((res) => res.json());
      if (res.error) {
        if (res.error.status === 401) {

        }
        return;
      }
      console.log("Got devices", devices);
      setDevices(res.devices);
    } catch (e) {
      console.log("Failed to fetch devices", e);
    }
  };

  const transferPlayback = async (deviceId: string) => {
    try {
      const res = await fetch(`${config.api.spotify}/me/player`, { 
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({ device_ids: [deviceId], play: false })
      }).then((res) => res.json());
      console.log("Transferred playback", res);
      if (res.error) {
        if (res.error.status === 401) {
          
        }
        return;
      }
    } catch (e) {
      console.log("Failed to transfer playback", e);
    }
    handleDeviceMenuClose();
  };

  useEffect(() => {
    getAvailableDevices();
  }, []);

  return (
    <StyledBox {...boxProps} sx={{ display: "flex", ...boxProps?.sx }}>
        <Button aria-label="Connect to device" color="info" size="small" disabled={disabled} onClick={handleDeviceButtonClick}>
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
                  <ListItemButton onClick={() => { transferPlayback(id) }}>
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
