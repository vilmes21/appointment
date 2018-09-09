import moment from 'moment';

export default (thisContext) => {
    return (focusDate, flipUnit, prevOrNext) => {
        //console.log("entered fun handleNavigate....")
    
        //note: `focusDate` param isn't useful.
        const _this = thisContext;
        const {dayChosen} = _this.state;
    
        //BEGIN restrict patients to view only this week + next
        const now = new Date();
        const nowNum = now.getDate();
        const nextWeekToday = moment()
            .add(7, "day")
            .toDate();
        const nextWeekTodayNum = nextWeekToday.getDate();
    
        const dayChosenNum = dayChosen.getDate();
        
        if (prevOrNext === "NEXT" && dayChosenNum === nowNum) {
            _this.setState({dayChosen: nextWeekToday});
        } else if (prevOrNext === "PREV" && dayChosenNum === nextWeekTodayNum) {
            _this.setState({dayChosen: now});
        }
        //END restrict patients to view only this week + next
    }
}