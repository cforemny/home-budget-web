import React, {Component} from 'react';

import {
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';
import {AiFillHome} from "react-icons/ai";

export default class AppNavBar extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color='light' light expand="md">
                    <NavbarBrand href="/">
                        <AiFillHome size={40}/>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/expenses">Wydatki</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/incomes">Przychody</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/planner">Planer</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/summary">Podsumowanie</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/admin-panel">Panel administratora</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Test drop down
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Option 1
                                    </DropdownItem>
                                    <DropdownItem>
                                        Option 2
                                    </DropdownItem>
                                    <DropdownItem divider/>
                                    <DropdownItem>
                                        Reset
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}