import axios from "axios";
import Header from "../../components/Utils/Header";
import convert from "xml-js";
import { useEffect, useState } from "react";

import React from 'react';
import ReactDOM from "react";

import { FaHouse } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineApartment } from "react-icons/md";
import { FaThLarge } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { IoPerson } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from "react-toastify";

import { RowData } from "../../interface";


class App extends React.Component {
    state = {
        value: '',
        copied: false,
    }
}

export default function Housing() {

    const [rowData, setRowData] = useState<RowData[]>([]);
    const [selectedYear, setYear] = useState<Number>(2015);

    const years = Array.from({length: 2020 - 2004}, (_, index) => 2020 - index);

    useEffect(
        () => {
            const fetchData = async () => {
                const { data: response } = await axios.get(`/fetch-housing-data/${selectedYear}`);
                const result: any = convert.xml2json(response, {
                    compact: true,
                    spaces: 4
                })
                const jsonResult = JSON.parse(result);
                const rows = jsonResult.Grid_20151214000000000336_1.row;
                console.log(rows);
                setRowData(rows);
            }
            fetchData();
        }, [selectedYear]
    )

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target: { value } } = event;
        setYear(parseInt(value));
    }

    const handleTelephoneClick = () => {
        toast.success('클립보드에 복사하였습니다');
    }

    return (
        <>
            <Header />
            <div>
                <h1 className="font-semibold text-center text-[30px] p-[5px] mt-[20px]">전원마을 분양 공고 정보</h1>
                <h2 className="text-center md:text-right p-[5px]">농림수산식품교육문화정보원 제공 2005 ~ 2020</h2>
            </div>
            <div className="">
                <div className="flex justify-center">
                    <div className="my-[20px] w-[80%] md:w-full">
                        <select onChange={handleYearChange} id="spe_year" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="2015" selected>년도 선택 (2015)</option>
                            {years.map((year) => (
                                <option key={year} value={year} selected={year === selectedYear}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center my-[25px]">
                    <table className="border border-solid border-black-900 p-5 w-full md:w-[80%]">
                        <thead className="hidden md:table-header-group">
                            <tr className="bg-gray-300">
                                <th className="p-5">사업 명</th>
                                <th className="p-5">위치</th>
                                <th className="p-5">계획 세대 수</th>
                                <th className="p-5">총 부지 면적(제곱미터)</th>
                                <th className="p-5">분양공고일</th>
                                <th className="p-5">담당자 성명</th>
                                <th className="p-5">담당자 전화번호</th>
                            </tr>
                        </thead>
                        <thead>
                            <tr className="bg-gray-300 md:hidden">
                                <th className="p-5 "><FaHouse className="mx-auto" /></th>
                                <th className="p-5"><FaMapMarkerAlt className="mx-auto" /></th>
                                <th className="p-5"><MdOutlineApartment className="mx-auto" /></th>
                                <th className="p-5"><FaThLarge className="mx-auto" /></th>
                                <th className="p-5"><CiCalendarDate className="mx-auto" /></th>
                                <th className="p-5"><IoPerson className="mx-auto" /></th>
                                <th className="p-5"><MdLocalPhone className="mx-auto" /></th>
                            </tr>
                        </thead>

                        {rowData ? (
                            Object.keys(rowData).map((key: any, index) => (
                                <tbody>
                                    <tr key={index} className="hover:bg-gray-200 border border-solid border-black-200 text-[9px] md:text-[20px]">
                                        <td className="p-2 text-center break-all">{rowData[key].BIZ_NM._text}</td>
                                        <td className="p-2 text-center break-all">{rowData[key].LC_NM._text}</td>
                                        <td className="p-2 text-center">{rowData[key].PLAN_HSCNT._text}</td>
                                        <td className="p-2 text-center">{rowData[key].TOT_PLOT_AR._text}</td>
                                        <td className="p-2 text-center">{rowData[key].LTTOT_PBLANC_DE._text}</td>
                                        <td className="p-2 text-center">{rowData[key].CHARGER_NM._text}</td>
                                        <CopyToClipboard text={rowData[key].CHARGER_TELNO._text}>
                                            <td className="p-5 text-center hover:cursor-pointer text-blue-500 font-semibold" onClick={handleTelephoneClick}>{rowData[key].CHARGER_TELNO._text}</td>
                                        </CopyToClipboard>
                                    </tr>
                                </tbody>
                            ))
                        ) : (
                            <tbody>
                                <tr key="no-data">
                                    <td colSpan={7}>데이터가 존재하지 않습니다</td>
                                </tr>
                            </tbody>
                        )}
                        <tbody>

                        </tbody>
                    </table >
                </div>
            </div >
        </>

    )
}