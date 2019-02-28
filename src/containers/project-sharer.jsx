import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

/**
 * 프로젝트 공유하기 버튼
 * 실시간으로 교사와 수강생이 진행중인 프로젝트를 공유할 수 있도록 
 * 프로젝트 파일을 스토리지에 업로드 하고, 
 * 업로드된 경로를 리턴한다.
 * 
 * <ProjectSharer>{(shareProject, props) => (
 *     <MyCoolComponent
 *         onClick={shareProject}
 *         {...props}
 *     />
 * )}</ProjectSharer>
 */
class ProjectSharer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [            
            'shareProject'
        ]);
    }    
    shareProject () {
        this.props.vm.saveProjectSb3().then(content => {
            // TODO user-friendly project name
            // File name: project-DATE-TIME
            const date = new Date();
            var mm = date.getMonth() + 1;
            var dd = date.getDate();
            var yyyymmdd = [date.getFullYear(),
                              (mm>9 ? '' : '0') + mm,
                              (dd>9 ? '' : '0') + dd
                             ].join('');
            var hh = date.getHours();
            var mi = date.getMinutes();
            var ss = date.getSeconds();
            var hhmmss = [(hh > 9 ? '' : '0') + hh,
                             (mi > 9 ? '' : '0') + mi,
                             (ss > 9 ? '' : '0') + ss, ].join('');

            const timestamp = `${yyyymmdd}${hhmmss}`;
            const filename = `moducoding_project_${timestamp}.sb3`;

            console.log('project save start!');

            const data = new FormData();
            data.append('file', content);
            data.append('name', filename);

            console.log('formdata create!');

            axios
              .post('http://localhost:5060/LMS/Lecture/UploadScratch', data, {
                onUploadProgress: ProgressEvent => {
                  this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                  })
                },
              })
              .then(res => {
                console.log(res);
                console.log(res.statusText);
              });
        });
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            children,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return this.props.children(this.shareProject, props);
    }
}

ProjectSharer.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectSharer);
