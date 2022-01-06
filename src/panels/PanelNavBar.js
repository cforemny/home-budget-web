import React, {Component} from 'react';

export default class PanelNavBar extends Component {

    getMonthName() {
        const months = [
            'styczeń',
            'luty',
            'marzec',
            'kwiecien',
            'maj',
            'czerwiec',
            'lipiec',
            'sierpień',
            'wrzesień',
            'październik',
            'listopad',
            'grudzien'
        ]
        return months[this.props.month - 1]
    }

    render() {
        return (
            <div>
                    <h3 className="text-muted">{this.props.panelName} {this.getMonthName()}</h3>
            </div>
        );
    }
}