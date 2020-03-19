import {
  h, asRoughMs, BaseComponent, ComponentContext, DateProfile, Fragment, DateRange, DateMarker, getDateMeta, getSlotClassNames, buildNavLinkData, RenderHook
} from '@fullcalendar/core'
import { TimelineDateProfile } from './timeline-date-profile'


export interface TimelineHeaderRowsProps {
  dateProfile: DateProfile
  tDateProfile: TimelineDateProfile
  nowDate: DateMarker
  todayRange: DateRange
}

export default class TimelineHeaderRows extends BaseComponent<TimelineHeaderRowsProps> {


  render(props: TimelineHeaderRowsProps, state: {}, context: ComponentContext) {
    let { dateEnv, options } = context
    let { tDateProfile } = props
    let { cellRows } = tDateProfile
    let isChrono = asRoughMs(tDateProfile.labelInterval) > asRoughMs(tDateProfile.slotDuration) // displays times? (i think?)

    return (
      <Fragment>
        {cellRows.map((rowCells, i) => {
          let isLast = i === cellRows.length - 1

          return (
            <tr class={'fc-timeline-header-row' + ((isChrono && isLast) ? ' fc-timeline-header-row-chrono' : '')}>
              {rowCells.map((cell) => {
                let classNames = [ 'fc-timeline-slot', 'fc-timeline-slot-label' ].concat(getSlotClassNames(
                  getDateMeta(cell.date, props.todayRange, props.nowDate),
                  context.theme
                ))

                if (cell.isWeekStart) {
                  classNames.push('fc-timeline-slot-em')
                }

                let navLinkData = (options.navLinks && cell.rowUnit && cell.rowUnit !== 'time')
                  ? buildNavLinkData(cell.date, cell.rowUnit)
                  : null

                let mountProps = {
                  date: dateEnv.toDate(cell.date),
                  view: context.view
                }
                let dynamicProps = {
                  ...mountProps,
                  text: cell.text,
                  navLinkData
                }

                return (
                  <RenderHook name='slotLabel' mountProps={mountProps} dynamicProps={dynamicProps} defaultInnerContent={renderInnerContent}>
                    {(rootElRef, customClassNames, innerElRef, innerContent) => (
                      <th ref={rootElRef} class={classNames.concat(customClassNames).join(' ')}
                        data-date={dateEnv.formatIso(cell.date, { omitTime: !tDateProfile.isTimeScale, omitTimeZoneOffset: true })}
                        colSpan={cell.colspan}
                      >
                        <div class='fc-scrollgrid-shrink-block'>
                          <span class='fc-sticky' className={'fc-timeline-slot-span fc-scrollgrid-shrink-span ' + (isLast ? '' : ' fc-sticky')} ref={innerElRef}>
                            {innerContent}
                          </span>
                        </div>
                      </th>
                    )}
                  </RenderHook>
                )
              })}
            </tr>
          )
        })}
      </Fragment>
    )
  }

}

function renderInnerContent(props) { // TODO: add types
  return (
    <a data-navlink={props.navLinkData}>
      {props.text}
    </a>
  )
}
