import React, {
    Component
} from 'react';

class Gif extends Component {

    // when our video has loaded we add a loaded classname otherwise the vieo syas hidden

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    render() {
        const {
            loaded
        } = this.state;
        const {
            images
        } = this.props;
        return (
            // when we have the loaded state as true, then we add the loaded class
            <
            video className = {
                `grid-item video ${loaded && 'loaded'}`
            }
            autoPlay loop src = {
                images.original.mp4
            }
            // when the video loads we set the loaded state to be true
            onLoadedData = {
                () => this.setState({
                    loaded: true
                })
            }
            />
        )
    }
}

export default Gif;
