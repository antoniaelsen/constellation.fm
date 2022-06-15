import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

// Expansion panel 'expanded' pseudoclass
//  https://github.com/mui-org/material-ui/issues/16051
interface NavExpansionPanelProps {
  details: React.ReactNode,
  title: string,
}


const NavExpansionPanel: React.SFC<NavExpansionPanelProps> = (props) => {
  const { details, title } = props;
  const aria = `panel${title ? '_' + title : ''}`;

  return (
    <Accordion sx={{
        '&$expanded': {
          margin: 0
        },
      }}
      defaultExpanded={true}
    >
      <AccordionSummary
        aria-controls={`${aria}-content`}
        expandIcon={<ExpandMoreIcon color='primary' />}
        id={`${aria}-header`}
      >
        <Typography
          sx={(theme) => ({ fontSize: theme.typography.pxToRem(24) })}
          color='primary'
          variant='button'
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {details}
      </AccordionDetails>
    </Accordion>
  );
}

export default NavExpansionPanel;
