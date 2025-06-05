'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppHeaderBottomBar from './AppHeaderBottomBar';

/**
 * AppDropdownButton 컴포넌트의 아이템 인터페이스
 * @interface DropdownItem
 * @property {string} label - 드롭다운 메뉴 아이템 텍스트
 * @property {string} href - 드롭다운 메뉴 아이템 이동 경로
 */
interface DropdownItem {
	label: string;
	href: string;
}

/**
 * AppDropdownButton 컴포넌트의 props 인터페이스
 * @interface DropdownButtonProps
 * @property {string} title - 드롭다운 버튼의 제목
 * @property {DropdownItem[]} items - 드롭다운 메뉴 아이템 배열
 * @property {string} id - 드롭다운 버튼 id
 */
interface DropdownButtonProps {
	title: string;
	items: DropdownItem[];
	id: string;
}

/**
 * AppDropdownButton 컴포넌트
 * @component
 * @example
 * ```tsx
 * <AppDropdownButton
 *   title="메뉴"
 *   items={[
 *     { label: "항목 1", href: "/item1" },
 *     { label: "항목 2", href: "/item2" }
 *   ]}
 *   id="menu-dropdown"
 * />
 * ```
 */
export default function AppDropdownButton({
	title,
	items,
	id,
}: DropdownButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

	/**
	 * 현재 페이지 경로를 추적하기 위해 사용
	 *
	 * 그러나 URL 변경 없이 상태로 각 컴포넌트를 관리하기에
	 *
	 * 이는 추후 수정
	 */
	const currentPath = usePathname();

	/**
	 * 현재 경로에 해당하는 드롭다운 아이템을 맨 위로 정렬하는 함수
	 */
	const getSortedItems = () => {
		return [...items].sort((a, b) => {
			if (a.href === currentPath) return -1;
			if (b.href === currentPath) return 1;
			return 0;
		});
	};

	/**
	 * 드롭다운 열림
	 */
	const openDropdown = () => {
		setIsOpen(!isOpen);
	};

	/**
	 * 드롭다운 닫힘
	 */
	const closeDropdown = useCallback(() => {
		setIsOpen(false);
	}, []);

	/**
	 * 드롭다운 외부 클릭 시 드롭다운 자동닫힘
	 */
	useEffect(() => {
		const clickDropdownOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			const isClickInside = dropdownRef.current?.contains(target);
			if (isOpen && !isClickInside) {
				closeDropdown();
			}
		};
		document.addEventListener('mousedown', clickDropdownOutside);
		return () => {
			document.removeEventListener('mousedown', clickDropdownOutside);
		};
	}, [isOpen, closeDropdown]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				className="px-8 py-2 text-white cursor-pointer relative"
				onClick={openDropdown}
				aria-expanded={isOpen}
				aria-haspopup="true"
				aria-controls={`dropdown-menu-${id}`}
			>
				{title}
				<AppHeaderBottomBar isItems={items} isOpen={isOpen} />
			</button>

			{isOpen && (
				<div
					id={`dropdown-menu-${id}`}
					className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-32 bg-white shadow-xl border-1 border-black z-10"
					role="dropdown"
					aria-label={`${title} 메뉴`}
				>
					<div>
						{getSortedItems().map((item) =>
							currentPath === item.href ? (
								<span
									key={item.href}
									className="grid place-items-center w-full py-2 text-sm pretendard-700 bg-ossca-mint-300 cursor-text"
									role="selectedDropdownItem"
									aria-current="page"
								>
									{item.label}
								</span>
							) : (
								<Link
									key={item.href}
									href={item.href}
									onClick={closeDropdown}
									className="grid place-items-center w-full py-2 text-sm pretendard-500 hover:bg-gray-100"
									role="dropdownItems"
								>
									{item.label}
								</Link>
							),
						)}
					</div>
				</div>
			)}
		</div>
	);
}
