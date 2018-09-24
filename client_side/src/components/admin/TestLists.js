// import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import ListItemText from '@material-ui/core/ListItemText';
// import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import CommentIcon from '@material-ui/icons/Comment';

// const styles = theme => ({
//   root: {
//     width: '100%',
//   },
// });

// class CheckboxList extends React.Component {
//   state = {
//     checked: [0],
//   };

//   handleToggle = value => () => {
//     const { checked } = this.state;
//     const currentIndex = checked.indexOf(value);
//     const newChecked = [...checked];

//     if (currentIndex === -1) {
//       newChecked.push(value);
//     } else {
//       newChecked.splice(currentIndex, 1);
//     }

//     this.setState({
//       checked: newChecked,
//     }, () => {console.log(this.state)});
//   };

//   render() {
//     const { classes } = this.props;

//     return (
//       <div className={classes.root}>
//         <List>
//           {[10, 221, 332, 443].map(value => (
//             <ListItem
//               key={value}
//               role={undefined}
//               dense
//               button
//               onClick={this.handleToggle(value)}
//             >
         
//          <Checkbox
//                 checked={this.state.checked.indexOf(value) !== -1}
//                 tabIndex={-1}
//                 disableRipple
//                 // disabled={true}
//               />

//               <ListItemText primary={`Sep 22 2018 11:31:45 ${value + 1}`} />
//               <ListItemText secondary={`Adam Larson ${value + 1}`} />
//               <ListItemText secondary={`ep 22 2018 11:31: ${value + 1}`} />

//             </ListItem>
//           ))}
//         </List>
//       </div>
//     );
//   }
// }

// CheckboxList.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(CheckboxList);