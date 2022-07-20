import React, {useRef} from 'react';

// import {XYCoord} from 'dnd-core';
// import {DropTargetMonitor, useDrag, useDrop} from 'react-dnd';
// import {DnDTypes} from 'lib/dndTypes';

import { Theme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
// import ListItemIcon from '@mui/material/ListItemIcon';

import {Constellation} from 'types/constellation';
interface DragItem {
  id: number;
  index: number;
  type: string;
}

export interface OwnProps extends Partial<Constellation> {
  id: number;
  // index: number;
  // move: (id: number, index: number) => void;
  // update: (constellation: Partial<Constellation>) => void;
}

export const DragListItem: React.SFC<OwnProps> = (props) => {
  const {
    displayName,
    id,
    // index,
    // move,
    // update
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const labelId = `checkbox-list-label-${id}`;


  // React DnD drag implementation
  // const [{isDragging}, drag, preview] = useDrag({
  //   item: { id, type: DnDTypes.CONSTELLATION },  // Spec, available to drop targets
  //   collect: monitor => ({               // Props collected from drag monitor
  //     isDragging: monitor.isDragging(),
  //   }),
  // });

  // const [, drop] = useDrop({
  //   accept: DnDTypes.CONSTELLATION,
  //   hover(item: DragItem, monitor: DropTargetMonitor) {
  //     if (!ref.current) return;
  //     const dragIndex = item.index
  //     const hoverIndex = index;

  //     if (dragIndex === hoverIndex) return;

  //     const hoverBoundingRect = ref.current!.getBoundingClientRect()
  //     const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  //     const mousePosition = monitor.getClientOffset()
  //     const fromTopPosition = (mousePosition as XYCoord).y - hoverBoundingRect.top

  //     if (dragIndex < hoverIndex && fromTopPosition < hoverMiddleY) return;
  //     if (dragIndex > hoverIndex && fromTopPosition > hoverMiddleY) return;

  //     move(item.id, hoverIndex);

  //     // TODO(aelsen)
  //     // Note: we're mutating the monitor item here!
  //     // Generally it's better to avoid mutations,
  //     // but it's good here for the sake of performance
  //     // to avoid expensive index searches.
  //     item.index = hoverIndex;
  //   },
  // })

  // This component is both a drop target and drag item 
  // drop(preview(ref));
  return (
    <ListItem sx={(theme) => ({
        '&:hover': {
          backgroundColor: '#111',
        },
        borderRadius: theme.shape.borderRadius,
      })} key={id} role={undefined} dense disableGutters={true}>
      {/* <ListItemIcon ref={drag}>
        <IconButton edge="end" aria-label="collaborative icon">
          // Collaborative icon
        </IconButton>
      </ListItemIcon> */}
      <ListItemText
        sx={(theme) => ({ margin: `calc(${theme.spacing(1)} / 2) ${theme.spacing(1)}` })}
        id={labelId}
        primary={displayName}
      />
    </ListItem>
  );
}