import React  from 'react';

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';

import { Playlists } from 'components/Playlists';

import { Constellation } from 'store/types/constellation';
import { StyledBox } from 'components/StyledBox';


const drawerWidth = 240;
interface Props {
  createConstellation: (constellation: Partial<Constellation>) => void;
}

export const Nav: React.SFC<Props> = (props) => {
  return (
    <nav>
      {/* Nav Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          }
        }}
        anchor="left"
        variant="permanent"
      >
        <StyledBox sx={(theme) => ({
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-end',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
        })}>
        </StyledBox>
        <Divider />
        <Playlists />
        
      </Drawer>
    </nav>
  );
}

