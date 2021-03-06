import React, {Component} from 'react';

import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';

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

    logout() {
        sessionStorage.setItem('isUserValid', 'false');
        window.location.reload(false);
    }

    render() {
        return (
            <div>
                <Navbar color='light' light expand="md">
                    <NavbarBrand href="/">Strona glowna</NavbarBrand>
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
                                <NavLink href="/accounts">Stan kont</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/admin-panel">Panel administratora</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={this.logout}>Wyloguj</NavLink>
                            </NavItem>
                            {/*moze sie przyda*/}
                            {/*<UncontrolledDropdown nav inNavbar>*/}
                            {/*    <DropdownToggle nav caret>*/}
                            {/*        Test drop down*/}
                            {/*    </DropdownToggle>*/}
                            {/*    <DropdownMenu right>*/}
                            {/*        <DropdownItem>*/}
                            {/*            Option 1*/}
                            {/*        </DropdownItem>*/}
                            {/*        <DropdownItem>*/}
                            {/*            Option 2*/}
                            {/*        </DropdownItem>*/}
                            {/*        <DropdownItem divider/>*/}
                            {/*        <DropdownItem>*/}
                            {/*            Reset*/}
                            {/*        </DropdownItem>*/}
                            {/*    </DropdownMenu>*/}
                            {/*</UncontrolledDropdown>*/}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}