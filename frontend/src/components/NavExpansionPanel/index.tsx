import React from 'react';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: theme.typography.pxToRem(24),
    },
  })
);

// Expansion panel 'expanded' pseudoclass
//  https://github.com/mui-org/material-ui/issues/16051
const useStylesPanel = makeStyles((theme: Theme) =>
  createStyles({
    expanded: {},
    root: {
      '&$expanded': {
        margin: 0
      },
    },
  })
);


interface NavExpansionPanelProps {
  details: React.ReactNode,
  title: string,
}


const NavExpansionPanel: React.SFC<NavExpansionPanelProps> = (props) => {
  const classes = useStyles();
  const classesPanel = useStylesPanel();
  const { details, title } = props;
  const aria = `panel${title ? '_' + title : ''}`;

  return (
    <Accordion classes={classesPanel} defaultExpanded={true} >
      <AccordionSummary
        aria-controls={`${aria}-content`}
        expandIcon={<ExpandMoreIcon color='primary' />}
        id={`${aria}-header`}
      >
        <Typography
          className={classes.title}
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
