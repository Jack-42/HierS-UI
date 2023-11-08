import {Input, Listbox, ListboxItem, ScrollShadow} from "@nextui-org/react";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartNetwork, faCircleNotch} from "@fortawesome/pro-light-svg-icons";
import axios from "axios";

async function fetchSearchResults(inputVal: string) {
    const apiUrl = `http://localhost:8000/api/v1/search/`;

    return await axios.get(apiUrl, {
        params: {
            query: inputVal
        }
    })
        .then(promise => {
            return promise.data;
        })
        .catch(e => {
            console.error(e);
        })
}

export default function SearchResults({ setChem }: { setChem: Dispatch<SetStateAction<object>> }) {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchResultBullet = <FontAwesomeIcon icon={faChartNetwork} className="text-primary mr-2" />;
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (searchInput && searchInput.length) {
                setLoader(true);

                const data = await fetchSearchResults(searchInput);

                if (data.length) {
                    setSearchResults(data);
                }
            }

            setLoader(false);
        }

        fetchData();
    }, [ searchInput ]);

    const onSearchInput = (e) => {
        setSearchResults([]);
        setSearchInput(e);
    }

    return (
        <div id="search-container">
            <section className="w-1/2 m-auto">
                <Input
                    id="search-input"
                    key="default"
                    type="email"
                    color="default"
                    size="lg"
                    label="Search"
                    placeholder="Start typing"
                    defaultValue=""
                    onValueChange={onSearchInput}
                    isClearable
                    onClear={() => setSearchResults([])}
                    classNames={{
                        inputWrapper: [
                            "border",
                            "dark:border-gray-600/40",
                            "backdrop-blur-md",
                            "dark:bg-gray-600/30",
                            "dark:hover:bg-gray-600/50",
                            "dark:focus:bg-gray-600/50",
                            "dark:active:bg-gray-600/50",
                            "mb-8"
                        ],
                    }}
                />
            </section>

            <section className={'glass-container gap-0 p-0 ' + (searchResults.length ? 'active' : '')}>
                <div className={'loader ' + (loader ? 'active' : '')}>
                    <FontAwesomeIcon icon={faCircleNotch} className="text-primary animate-spin" />
                </div>

                <ScrollShadow size={100} className="scroll-shadow">
                    <Listbox id="search-results-list" variant="flat" aria-label="Search Results">
                        {
                            searchResults.map((result, index) => (
                                <ListboxItem
                                    key={index}
                                    description={(result.pert_name + ' - ' + result.moa)}
                                    startContent={searchResultBullet}
                                    className="search-result"
                                    color="primary"
                                    classNames={{
                                        base: "text-xl",
                                        title: "text-lg transition-colors",
                                        description: "text-sm transition-colors"
                                    }}
                                    onClick={() => {setChem(result)}}
                                >
                                    {result.pert_name}
                                </ListboxItem>
                            ))
                        }
                    </Listbox>
                </ScrollShadow>
            </section>
        </div>
    )
}