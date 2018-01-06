// import React from 'react';
// import axios from "axios";
// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom'

// import Calendar from "./Calendar"
// import TestComp from './TestComp';

// class DrCalendar extends React.Component {

//   render(){
//     const _this = this;
//     const dr = _this.props.dr;
//     const linkData = _this.props.linkData;

//     console.log("in render func. _this.props.dr >>>", dr);
//     console.log("in render func. _this.props.linkData >>>", _this.props.linkData);

//     return (
//               <div key={dr.id}>
//                 <Link 
//                     to={linkData} >
//                   {dr.firstname} {dr.lastname} | Bio: {dr.bio} <hr/>
//                 </Link>
//               </div>
//     );
//   }
// }

// export default DrCalendar;