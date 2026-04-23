import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import TeamPerformanceChart from "./TeamPerformanceChart";

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

describe("TeamPerformanceChart", () => {
	const mockData = [{ name: "Team A", jobs: 10, time: 120 }];

	it("should render chart title", () => {
		render(<TeamPerformanceChart data={mockData} />);
		expect(screen.getByText("Ekip Performansı")).toBeInTheDocument();
	});
});
