import React, {Component} from 'react';
import PropTypes from 'prop-types';
import menu from './menu.svg';

class ListView extends Component {
	// Ensure props are the right variable type
	static propTypes = {
		markers: PropTypes.array.isRequired,
		onToggleInfoWindow: PropTypes.func.isRequired,
		onFilterLocations: PropTypes.func.isRequired
	};

	state = {
		// Search query
		query: '',
		// Is list view hidden?
		isHidden: true
	};

	render() {
		const {markers, onToggleInfoWindow, onFilterLocations} = this.props;
		const {query, isHidden} = this.state;

		return (
			<div className={isHidden ? 'list-view hidden' : 'list-view'}>
        <div className="list-side">
          <input className="list-toggle" type="image" src={menu}
          	alt={isHidden ? 'Show list view' : 'Hide list view'}
          	onClick={() => this.setState({isHidden: !isHidden})}/>
        </div>
        <div className={isHidden ? "list-main hidden" : "list-main"}>
          <h1 className="list-title" tabIndex={0}>Neighborhood Map</h1>
          <form className="list-form" onSubmit={e => onFilterLocations(e, query)}>
            <input className="list-search" type="text" placeholder="Search location"
              onChange={e => this.setState({query: e.target.value})}/>
            <input className="list-submit" type="submit" value="Search"/>
          </form>
          <div className="list-locations">
            {markers.filter(marker => marker.isVisible).map(marker => (
              <div key={marker.id}>
                <button className={marker.showInfo ? 'list-button selected' : 'list-button'} type="button"
                  onClick={() => onToggleInfoWindow(marker)}>{marker.title}</button>
                <hr/>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
	}
}

export default ListView;
