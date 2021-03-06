import React from 'react';
import styles from './cms.scss';
import Cms from './cms';
import md from './md';
import { WithContext as ReactTags } from 'react-tag-input';
import Tags from "./tags";
import { Link } from 'react-router';

export default class Item extends React.Component {
	render() {
		const node = this.props.node;
		const fields = [];
		for (let i = 0; i < node.model.fields.length; i++) {
			fields.push(<Field key={i} node={node} field={node.model.fields[i]} setValue={this.props.setValue}/>);
		}
		const divs = [];
		divs.push(<form key="form">{fields}</form>);
		if (this.props.parent) {
			divs.push(<Link key="backBtn" id="backBtn" className="btn" to={ '/node/' + this.props.parent }>Back to list</Link>);
		}
 		return (
			<div>{divs}</div>
		);
	}
}

class Field extends React.Component {
	constructor(props) {
		super(props);
		this.setValue = this.setValue.bind(this);
		this.setArrayValue = this.setArrayValue.bind(this);
	}
	setValue(event) {
		var value;
		if (this.props.field.type == 'markdown') {
			value = md.html(event.target.value);
		} else if (this.props.field.type == 'boolean') {
			value = event.target.checked;
		} else {
			value = event.target.value;
		}
		this.props.setValue(this.props.node, this.props.field, value);
	}
	setArrayValue(value) {
		this.props.setValue(this.props.node, this.props.field, value);
	}
	render() {
		var field = this.props.field;
		var data = this.props.node.data;
		var name = Cms.fieldName(field);
		var displayName = Cms.fieldDisplayName(field);
		var value = data[name];
		var description = field.description ? <div><small>{field.description}</small></div> : '';
		var typeHelp = field.type
			? <div className="type">
					({field.type})
				</div>
			: '';
		var input;
		var className = field.className ? field.className : '';
		switch (field.type) {
			case 'textarea':
			case 'html':
				input = <textarea className={className} name={name} onChange={this.setValue}>{value}</textarea>;
				break;
			case 'markdown':
				input = <textarea className={className} name={name} onChange={this.setValue}>{md.md(value)}</textarea>;
				typeHelp =
					<div className="type">
						<a className="blue" target="_blank" href="http://commonmark.org/help/">(markdown)</a>
					</div>;
				break;
			case 'boolean':
				if (value) {
					input = <input className={className} type="checkbox" name={name} checked onChange={this.setValue}/>;
				} else {
					input = <input className={className} type="checkbox" name={name} onChange={this.setValue}/>;
				}
				break;
			case 'array':
				input = <Tags value={value} onChange={this.setArrayValue} />;
				break;
			default:
				input = <input className={className} type="text" name={name} value={value} onChange={this.setValue}/>;
		}
		return (
			<label>
				<strong>
					{displayName}
					{typeHelp}
				</strong>
				{description}
				{input}
			</label>
		);
	}
}
