import React, {Component} from 'react';

class ListView extends Component {
	state = {
		// Search query
		query: ''
	};

	render() {
		const {markers, onToggleInfoWindow, onFilterLocations} = this.props;
		const {query} = this.state;

		return (
			<div className="list-view">
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
    );
	}
}

export default ListView;
