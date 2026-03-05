import { Link } from "react-router-dom";

import Sidebar from "./Sidebar";

function RecommendedCourses(){
    return(
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    < Sidebar />
                </aside>  
                <section className="col-md-9">
                    <div className="card">
                        <h5 className="card-header text-start">Recommended Courses</h5>
                        <div className="card-body text-start">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Created By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Java Development</td>
                                        <td><Link to="/">Alex</Link></td>
                                        <td>
                                            <button className="btn btn-danger">Delete  <i class="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ajax Development</td>
                                        <td><Link to="/">John</Link></td>
                                        <td>
                                            <button className="btn btn-danger">Delete  <i class="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Frond-End Development</td>
                                        <td><Link to="/">Alex</Link></td>
                                        <td>
                                            <button className="btn btn-danger">Delete  <i class="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default RecommendedCourses;